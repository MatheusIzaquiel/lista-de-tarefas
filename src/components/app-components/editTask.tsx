"use client";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tasks } from "@/generated/prisma";
import { useState } from "react";
import { editTask } from "@/actions/editTasks";
import { toast } from "sonner";

type taskProps = {
  task: Tasks;
  handleGetTasks: () => void;
};

export default function EditTask({ task, handleGetTasks }: taskProps) {
  const [editedTask, setEditedTask] = useState(task.task);

  const handleEditTask = async () => {
    try {
      if (editedTask !== task.task) {
        toast.success("Tarefa alterada com sucesso");
      } else {
        toast.error("A tarefa n foi atualizada");
        return;
      }

      await editTask({ idTask: task.id, newTask: editedTask });
      handleGetTasks();
    } catch (error) {
      throw error;
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen size={18} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Editar tarefa"
            value={editedTask}
            onChange={(event) => setEditedTask(event.target.value)}
          />
          <DialogClose asChild> 
            <Button className="cursor-pointer" onClick={handleEditTask}>
              Editar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
