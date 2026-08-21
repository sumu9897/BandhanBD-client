export default function RecommendationCard({match}){
 return (
  <div className="rounded-2xl p-5 shadow-lg bg-white">
   <h3 className="font-bold">
    AI Match Recommendation
   </h3>
   <p>
    Compatibility Score: {match?.score || 0}%
   </p>
  </div>
 );
}
