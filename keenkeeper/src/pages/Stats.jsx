import { useContext } from 'react';
import { TimelineContext } from '../context/TimelineContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Stats() {
  const { timelineEntries } = useContext(TimelineContext);

  const callCount = timelineEntries.filter(e => e.type === 'Call').length;
  const textCount = timelineEntries.filter(e => e.type === 'Text').length;
  const videoCount = timelineEntries.filter(e => e.type === 'Video').length;

  const data = [
    { name: 'Call', value: callCount },
    { name: 'Text', value: textCount },
    { name: 'Video', value: videoCount },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Friendship Analytics</h2>
      <div className="bg-white p-8 rounded-xl border shadow-sm flex flex-col items-center">
        {timelineEntries.length === 0 ? (
          <p className="text-gray-500">No data available yet. Make some calls/texts!</p>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
               <span className="text-sm"><span className="inline-block w-3 h-3 bg-[#0088FE] mr-1 rounded-full"></span>Calls</span>
               <span className="text-sm"><span className="inline-block w-3 h-3 bg-[#00C49F] mr-1 rounded-full"></span>Texts</span>
               <span className="text-sm"><span className="inline-block w-3 h-3 bg-[#FFBB28] mr-1 rounded-full"></span>Videos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}