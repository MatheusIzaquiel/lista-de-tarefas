"use client";
import { ArrowDown, Check, List } from "lucide-react";
import { Badge } from "../ui/badge";

export type FilterType = "all" | "pending" | "completed";

type FilterProps = {
  currentFilter: FilterType
  setCurrentFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

export default function filter({
  currentFilter,
  setCurrentFilter,
}: FilterProps) {
  return (
    <div className="flex items-start gap-2">
      <Badge
        variant={`${currentFilter === "all" ? "default" : "outline"}`} //Foi criado um operador ternário que altera o tipo do botão "default" = Azul, "outline" = branco
        onClick={() => setCurrentFilter("all")} //função onde é alterado o valor do estado currentFilter
        className="cursor-pointer"
      >
        <List />
        Todas
      </Badge>
      <Badge
        variant={`${currentFilter === "pending" ? "default" : "outline"}`}
        onClick={() => setCurrentFilter("pending")}
        className="cursor-pointer"
      >
        <ArrowDown />
        Não finalizadas
      </Badge>
      <Badge
        variant={`${currentFilter === "completed" ? "default" : "outline"}`}
        onClick={() => setCurrentFilter("completed")}
        className="cursor-pointer"
      >
        <Check /> Concluídas
      </Badge>
    </div>
  );
}
