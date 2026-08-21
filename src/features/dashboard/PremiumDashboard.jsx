import CompatibilityScore from "../ai/components/CompatibilityScore";

export default function PremiumDashboard(){
 return (
  <div className="grid md:grid-cols-3 gap-6">
    <CompatibilityScore/>
    <div className="rounded-3xl shadow-xl p-6 bg-white">
      Profile Completion
    </div>
    <div className="rounded-3xl shadow-xl p-6 bg-white">
      Smart Recommendations
    </div>
  </div>
 );
}
