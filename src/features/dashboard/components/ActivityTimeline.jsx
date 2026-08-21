export default function ActivityTimeline(){
 return (
  <div className="rounded-3xl shadow-xl p-6 bg-white">
    <h2 className="font-bold text-xl">
      Recent Activity
    </h2>
    <ul className="mt-4 space-y-3">
      <li>New profile viewed</li>
      <li>New match recommendation generated</li>
      <li>Premium subscription active</li>
    </ul>
  </div>
 );
}
