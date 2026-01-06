import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Team } from '../models/team.model';
import User from '../models/user.model';
import { AppError } from '../utils/AppError';

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, members } = req.body;

    const userId = (req as any).user.id;

    // Ensure the creator is in the members list
    const membersList = members ? [...members] : [];
    if (!membersList.includes(userId)) {
      membersList.push(userId);
    }

    const team = await Team.create({
      name,
      description,
      members: membersList,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (err: any) {
    next(err);
  }
};

// @desc    Get all teams for the logged in user
// @route   GET /api/teams
// @access  Private
export const getTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;

    const teams = await Team.find({ members: userId })
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (err: any) {
    next(err);
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
export const getTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const team = await Team.findById(req.params.id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    // Check if user is a member of the team
    const isMember = team.members.some(
      (member: any) => member._id.toString() === userId
    );

    if (!isMember) {
      return next(new AppError('Not authorized to access this team', 403));
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (err: any) {
    next(err);
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
export const updateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    let team = await Team.findById(req.params.id);

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    // Check ownership
    if (team.createdBy.toString() !== userId) {
      return next(new AppError('Not authorized to update this team', 403));
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (err: any) {
    next(err);
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
export const deleteTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    // Check ownership
    if (team.createdBy.toString() !== userId) {
      return next(new AppError('Not authorized to delete this team', 403));
    }

    await team.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err: any) {
    next(err);
  }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private
export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const userId = (req as any).user.id;

    if (!email) {
      return next(new AppError('Please provide an email', 400));
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    // Only creator can add members (for now detailed permission logic is skipped)
    if (team.createdBy.toString() !== userId) {
      return next(
        new AppError('Not authorized to add members to this team', 403)
      );
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return next(new AppError('User not found', 404));
    }

    // Check if duplicate
    const isAlreadyMember = team.members.some(
      (memberId) => memberId.toString() === userToAdd._id.toString()
    );

    if (isAlreadyMember) {
      return next(new AppError('User is already a member of this team', 400));
    }

    team.members.push(userToAdd._id as mongoose.Types.ObjectId);
    await team.save();

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (err: any) {
    next(err);
  }
};
