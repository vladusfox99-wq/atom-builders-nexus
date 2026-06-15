export interface CommitteeMember {
  name: string;
  organization?: string;
  role?: string;
}

export interface Committee {
  id: string;
  title: string;
  leader?: string;
  leaderRole?: string;
  description: string;
  directions: string[];
  members: CommitteeMember[];
}

type CmsTextItem = string | { text?: string };
type CmsCommitteeMember = Partial<CommitteeMember>;
type CmsCommittee = Omit<Partial<Committee>, "directions" | "members"> & {
  directions?: CmsTextItem[];
  members?: CmsCommitteeMember[];
};

const cmsCommitteeModules = import.meta.glob("./cms/committees/*.json", { eager: true });

const normalizeTextList = (values: CmsTextItem[] | undefined) =>
  (values ?? [])
    .map((value) => {
      if (typeof value === "string") return value;
      if (value && typeof value.text === "string") return value.text;
      return null;
    })
    .filter((value): value is string => Boolean(value));

const normalizeCommittee = (raw: CmsCommittee): Committee | null => {
  if (
    typeof raw.id !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.description !== "string"
  ) {
    return null;
  }

  const members = (raw.members ?? [])
    .filter((member) => typeof member.name === "string")
    .map((member) => ({
      name: member.name as string,
      organization:
        typeof member.organization === "string" && member.organization.trim()
          ? member.organization.trim()
          : undefined,
      role:
        typeof member.role === "string" && member.role.trim() ? member.role.trim() : undefined,
    }));

  return {
    id: raw.id,
    title: raw.title,
    leader: typeof raw.leader === "string" && raw.leader.trim() ? raw.leader.trim() : undefined,
    leaderRole:
      typeof raw.leaderRole === "string" && raw.leaderRole.trim()
        ? raw.leaderRole.trim()
        : undefined,
    description: raw.description,
    directions: normalizeTextList(raw.directions),
    members,
  };
};

export const committees: Committee[] = Object.values(cmsCommitteeModules)
  .map((module) => normalizeCommittee((module as { default: CmsCommittee }).default))
  .filter((committee): committee is Committee => committee !== null)
  .sort((left, right) => left.title.localeCompare(right.title, "ru"));

