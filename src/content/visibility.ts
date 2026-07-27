export const hiddenCommitteeIds = new Set(["international-cooperation"]);

export const isCommitteeHidden = (committeeId: string) => hiddenCommitteeIds.has(committeeId);
