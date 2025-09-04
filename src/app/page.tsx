"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import EditTask from "@/components/app-components/editTask";
import ClearTask from "@/components/app-components/clearTask";
import { Tasks } from "@/generated/prisma";
import { getTasks } from "@/actions/getTasksDb";
import { addNewTask } from "@/actions/addTasks";
import { deleteTasks } from "@/actions/deleteTasks";
import { updateTaskStatus } from "@/actions/updateTasksStatus";
import {
  ArrowDown,
  Check,
  List,
  ListCheck,
  Plus,
  Sigma,
  Trash,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [taskList, setTaskList] = useState<Tasks[]>([]);
  const [task, setTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //Essa função pega os dados que estão no banco de dados
  const handleGetTasks = async () => {
    try {
      const tasks = await getTasks();
      if (!tasks) return; //Os if que estão no código são tratamento para evitar certos erros, como receber um input vazio entre outros
      setTaskList(tasks);
    } catch (error) {
      throw error;
    }
  };

  //Essa função adiciona dados no banco de dados
  const handleAddTask = async () => {
    try {
      setLoading(true);
      if (task.length === 0 || !task) {
        toast.error("Digite algo para adicionar uma tarefa");
        setLoading(false);
        return;
      }

      const myNewTask = await addNewTask(task);

      if (!myNewTask) return;
      await handleGetTasks(); //Para atualizar automaticamente os itens, nos chamamos a função handleGetTasks no final da handleaddTask.
      setTask(""); //Altera o estado do input para que fique vazio, mas tem que adicionar um value={task} no input
      toast.success(
        `A atividade, ${task}, foi adicionada ao banco de dados com sucesso`
      );
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  //Essa função remove dados no banco de dados
  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) return;
      const deletedTask = await deleteTasks(id); //Vai deletar um item do banco de dados com base no seu id
      if (!deletedTask) return;
      await handleGetTasks(); //Chamando a função handleGetTasks para atualizar o estado dos itens
      toast.warning("A atividade foi apagada");
    } catch (error) {
      throw error;
    }
  };

  //função usada para alterar o status das tarefas da lista verde = concluida, vermelho = não concluída
  const handleToggleTask = async (taskId: string) => {
    const previousTasks = [...taskList];

    try {
      //Essa função altera o valor do done para true ou false, mas apenas no front-end
      setTaskList((prev) => {
        const updatedTaskList = prev.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              done: !task.done,
            };
          } else {
            return task;
          }
        });
        return updatedTaskList;
      });
      //Essa função altera o valor de true ou false no banco de dados
      updateTaskStatus(taskId);
    } catch (error) {
      setTaskList(previousTasks);
      throw error;
    }
  };

  useEffect(() => {
    handleGetTasks();
  }, []);

  return (
    <main className="w-full h-screen bg-gray-300 flex items-center justify-center">
      <div>
        <Card className="w-lg ">
          <CardHeader className="flex gap-2">
            <Input
              placeholder="Adicionar tarefa"
              value={task}
              onChange={(event) => setTask(event.target.value)}
            />
            <Button
              variant="default"
              className="cursor-pointer"
              onClick={handleAddTask}
            >
              {loading ? <LoaderCircle className="animate-spin" /> : <Plus />}
              Cadastrar
            </Button>
          </CardHeader>

          <CardContent>
            <Separator className="mb-4" />
            <div className="flex items-start gap-2">
              <Badge variant="default" className="cursor-pointer">
                <List />
                Todas
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                <ArrowDown />
                Não finalizadas
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                <Check /> Concluídas
              </Badge>
            </div>

            <div className="mt-2 py-2 flex flex-col gap-1">
              {taskList.map((task) => (
                <div
                  className="h-14 flex items-center justify-between border-b-1 border-t-1"
                  key={task.id}
                >
                  <div
                    className={`${
                      task.done
                        ? "w-1 h-full bg-green-400"
                        : "w-1 h-full bg-red-400"
                    }`}
                  ></div>
                  <p
                    className="flex-1 px-4 cursor-pointer hover:text-gray-700 "
                    onClick={() => handleToggleTask(task.id)}
                  >
                    {task.task}
                  </p>
                  <div className="flex gap-6">
                    <EditTask task={task} handleGetTasks={handleGetTasks} />{" "}
                    {/*Componente*/}
                    <Trash
                      size={18}
                      className="cursor-pointer"
                      onClick={() => handleDeleteTask(task.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 py-2">
                <ListCheck size={18} />
                <p className="text-xs"> Tarefas concluídas</p>
              </div>

              <ClearTask />
              {/*Componente*/}
            </div>
            <div className="h-2 w-full bg-amber-300 mt-4 rounded-md">
              <div
                className="h-full bg-blue-500 rounded-md"
                style={{ width: "50%" }}
              ></div>
            </div>

            <div className="flex justify-end items-center mt-2 gap-2">
              <Sigma size={18} />
              <p className="text-xs"> 3 tarefas no total</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
