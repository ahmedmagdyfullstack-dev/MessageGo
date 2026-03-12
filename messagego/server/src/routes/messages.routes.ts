import { Router } from "express";
import {
  handleSendMessage,
  handleGetMessage,
  handleListMessages,
} from "../controllers/messages.controller";

export const messagesRouter = Router();

messagesRouter.post("/", handleSendMessage);
messagesRouter.get("/", handleListMessages);
messagesRouter.get("/:id", handleGetMessage);
