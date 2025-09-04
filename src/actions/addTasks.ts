"use server";
import { prisma } from "@/utils/prisma";

export const addNewTask = async (tarefa: string) => {
  try {
    if (!tarefa) return;

    const newTask = await prisma.tasks.create({ //Aqui a constante NewTask recebe uma função que adiciona uma nova task no banco de dados
      data: { task: tarefa, done: false },
    });

    if (!newTask) return;

    return newTask;
  } catch (error) {
    throw error
  }
};
