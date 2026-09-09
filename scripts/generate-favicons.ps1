$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Convert the original logo without cropping or changing its proportions.
$projectRoot = Split-Path $PSScriptRoot -Parent
$source = [System.Drawing.Image]::FromFile((Join-Path $projectRoot 'src/assets/askao-logo.png'))
function Get-SquareLogoPng([int]$size) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $stream = [System.IO.MemoryStream]::new()
    try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $scale = $size / [double][Math]::Max($source.Width, $source.Height)
        $width = [int][Math]::Round($source.Width * $scale)
        $height = [int][Math]::Round($source.Height * $scale)
        $rectangle = [System.Drawing.Rectangle]::new([int](($size - $width) / 2), [int](($size - $height) / 2), $width, $height)
        $graphics.DrawImage($source, $rectangle)
        $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
        return ,$stream.ToArray()
    } finally {
        $stream.Dispose()
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}

try {
    [System.IO.File]::WriteAllBytes((Join-Path $projectRoot 'public/favicon.png'), (Get-SquareLogoPng 192))
    [System.IO.File]::WriteAllBytes((Join-Path $projectRoot 'public/apple-touch-icon.png'), (Get-SquareLogoPng 180))
    $sizes = @(16, 32, 48, 96, 128, 256)
    $frames = @($sizes | ForEach-Object { ,(Get-SquareLogoPng $_) })
    $stream = [System.IO.MemoryStream]::new()
    $writer = [System.IO.BinaryWriter]::new($stream)
    try {
        $writer.Write([uint16]0)
        $writer.Write([uint16]1)
        $writer.Write([uint16]$sizes.Count)
        $offset = 6 + 16 * $sizes.Count
        for ($i = 0; $i -lt $sizes.Count; $i++) {
            $dimension = if ($sizes[$i] -eq 256) { 0 } else { $sizes[$i] }
            $writer.Write([byte]$dimension)
            $writer.Write([byte]$dimension)
            $writer.Write([byte]0)
            $writer.Write([byte]0)
            $writer.Write([uint16]1)
            $writer.Write([uint16]32)
            $writer.Write([uint32]$frames[$i].Length)
            $writer.Write([uint32]$offset)
            $offset += $frames[$i].Length
        }
        foreach ($frame in $frames) { $writer.Write([byte[]]$frame) }
        $writer.Flush()
        [System.IO.File]::WriteAllBytes((Join-Path $projectRoot 'public/favicon.ico'), $stream.ToArray())
    } finally {
        $writer.Dispose()
        $stream.Dispose()
    }
} finally {
    $source.Dispose()
}
Write-Output 'Generated ASKAO favicon.png (192x192), apple-touch-icon.png (180x180), and multi-size favicon.ico.'
