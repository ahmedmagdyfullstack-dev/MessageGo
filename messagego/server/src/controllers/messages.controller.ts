import { Request, Response, NextFunction } from "express";
import {
  sendMessage,
  getMessage,
  listMessages,
} from "../services/message.service";
import { sendMessageSchema } from "../models/message.model";

export async function handleSendMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = sendMessageSchema.parse(req.body);
    const message = await sendMessage(parsed);

    res.status(202).json({
      id: message.id,
      status: message.status,
      channel: message.channel,
      to: message.to,
      createdAt: message.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const message = getMessage(req.params.id);

    if (!message) {
      res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Message ${req.params.id} not found`,
        },
      });
      return;
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
}

export async function handleListMessages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : undefined;
    const channel = req.query.channel as string | undefined;

    const result = listMessages({ limit, channel });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
