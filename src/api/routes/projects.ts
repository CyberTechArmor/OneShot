/**
 * Projects Routes
 * CRUD operations for projects.
 */

import { Router } from 'express';
import { z } from 'zod';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { projects } from '../../db/schema.js';
import { validateBody } from '../middleware/validate.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { errors } from '../middleware/error.js';
import { logger } from '../../lib/logger.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// ============================================================================
// Schemas
// ============================================================================

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['active', 'archived', 'completed']).optional(),
  currentPhase: z.enum(['discovery', 'design', 'stack', 'build']).optional(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/projects
 * List all projects for the current user.
 */
router.get('/', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const userProjects = await db.query.projects.findMany({
      where: and(
        eq(projects.ownerId, authReq.user.id),
        isNull(projects.deletedAt)
      ),
      orderBy: [desc(projects.createdAt)],
    });

    res.json({
      data: userProjects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        phase: p.currentPhase,
        totalTokensUsed: p.totalTokensUsed,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/projects
 * Create a new project.
 */
router.post('/', validateBody(CreateProjectSchema), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { name, description } = req.body as z.infer<typeof CreateProjectSchema>;

    const [project] = await db
      .insert(projects)
      .values({
        ownerId: authReq.user.id,
        name,
        description,
      })
      .returning();

    if (!project) {
      throw errors.internal('Failed to create project');
    }

    logger.info({ projectId: project.id, userId: authReq.user.id }, 'Project created');

    res.status(201).json({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      phase: project.currentPhase,
      totalTokensUsed: project.totalTokensUsed,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:id
 * Get a single project by ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const id = req.params.id;

    if (!id) {
      throw errors.validation('Project ID is required');
    }

    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, id),
        eq(projects.ownerId, authReq.user.id),
        isNull(projects.deletedAt)
      ),
    });

    if (!project) {
      throw errors.notFound('Project');
    }

    res.json({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      phase: project.currentPhase,
      totalTokensUsed: project.totalTokensUsed,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/projects/:id
 * Update a project.
 */
router.patch('/:id', validateBody(UpdateProjectSchema), async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const id = req.params.id;
    const updates = req.body as z.infer<typeof UpdateProjectSchema>;

    if (!id) {
      throw errors.validation('Project ID is required');
    }

    // Check project exists and belongs to user
    const existing = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, id),
        eq(projects.ownerId, authReq.user.id),
        isNull(projects.deletedAt)
      ),
    });

    if (!existing) {
      throw errors.notFound('Project');
    }

    const [updated] = await db
      .update(projects)
      .set({
        ...updates,
        currentPhase: updates.currentPhase,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      throw errors.internal('Failed to update project');
    }

    logger.info({ projectId: id, userId: authReq.user.id }, 'Project updated');

    res.json({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      status: updated.status,
      phase: updated.currentPhase,
      totalTokensUsed: updated.totalTokensUsed,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/projects/:id
 * Soft delete a project.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const id = req.params.id;

    if (!id) {
      throw errors.validation('Project ID is required');
    }

    // Check project exists and belongs to user
    const existing = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, id),
        eq(projects.ownerId, authReq.user.id),
        isNull(projects.deletedAt)
      ),
    });

    if (!existing) {
      throw errors.notFound('Project');
    }

    await db
      .update(projects)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id));

    logger.info({ projectId: id, userId: authReq.user.id }, 'Project deleted');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
