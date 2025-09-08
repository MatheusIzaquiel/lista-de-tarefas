"use server";
import { prisma } from "@/utils/prisma";

export const deleteCompletedTask = async () => {
  try {
    await prisma.tasks.deleteMany({
      where: { done: true },
    });

    const allTasks = prisma.tasks.findMany();

    if (!allTasks) return;
    return allTasks;  
  } catch (error) {
    throw error;
  }
};
