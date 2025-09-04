"use server";
import { prisma } from "@/utils/prisma";

export const deleteTasks = async (idTask: string) => {
  try {
    if(!idTask) return

    const deletedTasks = await prisma.tasks.delete({
      where: {
        id: idTask 
      }
    })

    if(!deletedTasks) return

    return deletedTasks
  } catch (error) {
    throw error
  }
}