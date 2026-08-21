export default function StatsCard({title,value}){
 return (
  <div className="rounded-3xl shadow-xl p-6 bg-white">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
  </div>
 );
}
