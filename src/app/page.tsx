"use client";
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
import {deleteCompletedTask} from "@/actions/deleteCompletedTasks"
import { ListCheck, Plus, Sigma, Trash, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Filter from "@/components/app-components/filter";
import { FilterType } from "@/components/app-components/filter";

export default function Home() {
  const [taskList, setTaskList] = useState<Tasks[]>([]);
  const [task, setTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [filteredTask, setFilteredTask] = useState<Tasks[]>([]);

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

  //função que apaga as tarefas concluidas 
  const clearCompletedTasks = async () => {
    const deletedTasks = await deleteCompletedTask()
    if(!deletedTasks) return
    setTaskList(deletedTasks)
  }



  useEffect(() => {
    handleGetTasks();
  }, []);

  //Esse useEffect é o filtro das tarefas, quando clica em um dos botões ele altera o valor do currentFilter, entra no switch e dependendo do botão que foi clicado ele vai fazer alguns filtros
  useEffect(() => {
    switch (currentFilter) {
      case "all": //Caso clique no botão todos(all) ele vai mostrar todos os itens no banco de dados
        setFilteredTask(taskList);
        break;
      case "pending": //Caso clique em não finalizados(pending) ele vai mostrar apenas os itens no banco de dados mostra o done=false
        const pendingTasks = taskList.filter((task) => !task.done);
        setFilteredTask(pendingTasks);
        break;
      case "completed": //Caso clique em Concluídas(completed) ele vai mostrar apenas os itens no banco de dados mostra o done=true
        const completedTasks = taskList.filter((task) => task.done);
        setFilteredTask(completedTasks);
        break;
      //Após o caso ele vai colocar o conteudo no setFilteredTask que vai alterar o estado dos itens na tela
      default:
        break;
    }
  }, [currentFilter, taskList]);

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
            <Filter
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />

            <div className="mt-2 py-2 flex flex-col gap-1">
              {taskList.length === 0 && (
                <p className="text-sm border-t-1 py-4">
                  Você não tem atividades cadastradas
                </p>
              )}
              {filteredTask.map((task) => (
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
                <p className="text-xs">
                  {" "}
                  Tarefas concluídas (
                  {taskList.filter((task) => task.done).length}/
                  {taskList.length})
                </p>
              </div>

              <ClearTask clearCompletedTasks={clearCompletedTasks} />
              {/*Componente*/}
            </div>
            <div className="h-2 w-full bg-gray-200 mt-4 rounded-md">
              <div
                className="h-full bg-blue-500 rounded-md"
                style={{
                  width: `${(taskList.filter((task) => task.done).length / taskList.length) * 100}%`
                }}
              ></div>
            </div>

            <div className="flex justify-end items-center mt-2 gap-2">
              <Sigma size={18} />
              <p className="text-xs"> {taskList.length} tarefas no total</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
