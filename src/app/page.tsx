import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowDown,
  Check,
  List,
  ListCheck,
  Plus,
  Sigma,
  SquarePen,
  Trash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <main className="w-full h-screen bg-gray-300 flex items-center justify-center">
      <div>
        <Card className="w-lg ">
          <CardHeader className="flex gap-2">
            <Input placeholder="Adicionar tarefa" />
            <Button variant="default" className="cursor-pointer">
              <Plus /> Cadastrar
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

            <div className="mt-4 py-2 flex flex-col gap-2">
              <div className="h-14 flex items-center justify-between border-b-1 border-t-1">
                <div className="w-1 h-full bg-green-300"></div>
                <p className="flex-1 px-4">Estudar React</p>
                <div className="cursor-pointer flex gap-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <SquarePen size={16} />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar tarefa</DialogTitle>
                      </DialogHeader>

                      <div className="flex gap-2">
                        <Input placeholder="Editar tarefa" />
                        <Button className="cursor-pointer">Editar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Trash size={18} />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 py-2">
                <ListCheck size={18} />
                <p className="text-xs"> Tarefas concluídas</p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="cursor-pointer text-xs h-7"
                    variant="outline"
                  >
                    <Trash /> Limpar tarefas concluídas
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja excluir esses itens?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Sim</AlertDialogAction>
                    <AlertDialogCancel>Não</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
