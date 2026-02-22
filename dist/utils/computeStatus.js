export function computeStatus(steps) {
    const values = Object.values(steps);
    if (values.every((v) => !v))
        return "planned";
    if (values.every((v) => v))
        return "done";
    return "ongoing";
}
//# sourceMappingURL=computeStatus.js.map