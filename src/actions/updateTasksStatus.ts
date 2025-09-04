"use server";
import { prisma } from "@/utils/prisma";

export const updateTaskStatus = async (taskId: string) => {
  try {
    // essa função pega o item q foi clicado no front-end pelo id
    const currentTask = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!currentTask) return;

    //essa função altera o valor do done no banco de dados, por padrão é false mas ao clucar ele pode variar entre true ou false
    const updatedStatus = await prisma.tasks.update({
      where: { id: taskId },
      data: { done: !currentTask.done }, //o valor começa como false mas com o !currentTask.done ele inverte o false para true
    });
    if (!updatedStatus) return;
    return updatedStatus;
  } catch (error) {
    throw error;
  }
};
