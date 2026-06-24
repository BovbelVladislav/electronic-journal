import { Router } from "express";
const router = Router();

router.post("/", (req, res) => res.status(201).json({ id: 1, name: req.body?.name || "Group A" }));
router.get("/:id", (req, res) => res.json({ id: Number(req.params.id), name: "Group A" }));

export default router;
