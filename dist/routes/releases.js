import { Router } from "express";
import { pool } from "../db.js";
import { computeStatus } from "../utils/computeStatus.js";
const router = Router();
const defaultSteps = {
    code_freeze: false,
    tests_passed: false,
    staging_deployed: false,
    qa_done: false,
    prod_deployed: false,
    monitoring_enabled: false,
    release_notes_sent: false,
};
router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM releases ORDER BY created_at DESC");
    const releases = result.rows.map((r) => ({
        ...r,
        status: computeStatus(r.steps),
    }));
    res.json(releases);
});
router.post("/", async (req, res) => {
    const { name, dueDate, additionalInfo } = req.body;
    if (!name || !dueDate) {
        return res.status(400).json({ message: "Name and dueDate required" });
    }
    const result = await pool.query(`INSERT INTO releases (name, due_date, additional_info, steps)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [name, dueDate, additionalInfo || null, defaultSteps]);
    const release = result.rows[0];
    res.status(201).json({
        ...release,
        status: computeStatus(release.steps),
    });
});
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { steps, additionalInfo } = req.body;
    const existing = await pool.query("SELECT * FROM releases WHERE id = $1", [
        id,
    ]);
    if (!existing.rows.length) {
        return res.status(404).json({ message: "Release not found" });
    }
    const updatedSteps = steps
        ? { ...existing.rows[0].steps, ...steps }
        : existing.rows[0].steps;
    const result = await pool.query(`UPDATE releases
     SET steps = $1,
         additional_info = COALESCE($2, additional_info),
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`, [updatedSteps, additionalInfo, id]);
    const release = result.rows[0];
    res.json({
        ...release,
        status: computeStatus(release.steps),
    });
});
router.delete("/:id", async (req, res) => {
    await pool.query("DELETE FROM releases WHERE id = $1", [req.params.id]);
    res.status(204).send();
});
export default router;
//# sourceMappingURL=releases.js.map