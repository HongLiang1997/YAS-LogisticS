import Classroom from "@/models/classroom";
import {Text} from "@mantine/core"
import { PieChart } from '@mantine/charts';

interface StatisticsViewProps {
  classroom: Classroom
}

function generateLoanedTrayData(classroom: Classroom) {
  const loanedTraysCount = classroom.trays.filter(tray => tray.bayID == null).length;
  const dockedTraysCount = classroom.trays.filter(tray => tray.bayID != null).length;

  return [
    { name: 'Loaned', value: loanedTraysCount, color: 'pink' },
    { name: 'Docked', value: dockedTraysCount, color: 'indigo' },
  ]
}

/**
 * TODO: Maybe show statistic on loan history (line chart), item loan history (pie chart)
 * @param classroom
 * @constructor
 */
export function StatisticsView({ classroom }: StatisticsViewProps) {
  return (
    <div>
      <Text fz="xs" mb="sm" ta="center">
        Current Tray Loaning Status
      </Text>
      <PieChart
        withLabelsLine
        labelsPosition="outside"
        labelsType="percent"
        data={generateLoanedTrayData(classroom)}
        withTooltip
        tooltipDataSource="segment"
        mx="auto"
      />
    </div>
  )
}