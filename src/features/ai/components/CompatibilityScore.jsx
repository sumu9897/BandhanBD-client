export default function CompatibilityScore({score=92}){
 return (
  <div className="rounded-3xl shadow-xl p-6 bg-white">
    <h3 className="font-bold">
      AI Compatibility Score
    </h3>
    <p className="text-4xl mt-3 font-bold">
      {score}%
    </p>
  </div>
 );
}
