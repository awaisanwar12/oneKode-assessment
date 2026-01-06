import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/task.model';
import { AppError } from '../utils/AppError';

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, priority, assignedTo, teamId, dueDate } = req.body;

    if (!teamId) {
      return next(new AppError('Team ID is required', 400));
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      teamId,
      dueDate,
      createdBy: (req as any).user ? (req as any).user.id : undefined,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, priority, teamId, assignedTo, search } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (teamId) query.teamId = teamId;
    if (assignedTo) query.assignedTo = assignedTo;

    // Simple text search using regex on title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query)
      .populate('teamId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('teamId')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return next(new AppError(`No task found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError(`No task found with id of ${req.params.id}`, 404));
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError(`No task found with id of ${req.params.id}`, 404));
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err: any) {
    next(err);
  }
};

export const getTaskStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Optional: match by teamId if provided
    const matchStage: any = {};
    if (req.query.teamId) {
      matchStage.teamId = new mongoose.Types.ObjectId(req.query.teamId as string);
    }

    const stats = await Task.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format output: { todo: 5, in_progress: 2 ... }
    const formattedStats = stats.reduce((acc: any, curr: any) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (err: any) {
    next(err);
  }
};
