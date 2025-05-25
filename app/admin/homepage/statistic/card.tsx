"use client";

import Image from "next/image";
import React from "react";
import { Statistic } from "./type";

type Props = { statistic: Statistic };

const StatisticCard = ({ statistic }: Props) => {
  return (
    <div className="flex flex-col items-center bg-blue-600 text-white p-5 rounded-xl shadow">
      <Image
        src={`/assets/icon/${statistic.id_icon}.png`}
        width={100}
        height={100}
        alt={statistic.id_icon}
      />
      <h4 className="text-lg font-bold">
        {statistic.value} {statistic.type_value}
      </h4>
      <h6>{statistic.title}</h6>
    </div>
  );
};

export default StatisticCard;
