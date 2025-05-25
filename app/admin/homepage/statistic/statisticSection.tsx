import React from "react";
import { Separator } from "@/components/ui/separator";
import StatisticForm from "./form";
import { Statistic } from "./type";

type Props = { statistics: Statistic[] };

const StatisticSection = ({ statistics }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-10">
      {statistics.map((statistic, i) => (
        <div key={i}>
          <h3 className="text-3xl font-semibold text-center">
            Statistik {i + 1}
          </h3>
          <Separator className="my-5" />
          <StatisticForm statistic={statistic} />
        </div>
      ))}
    </div>
  );
};

export default StatisticSection;
