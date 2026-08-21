export default function SmartProfileCard({profile}){
 return (
  <div className="rounded-3xl shadow-xl p-6 bg-white">
    <h3 className="font-bold text-xl">
      {profile?.name || "Smart Match"}
    </h3>
    <p className="mt-2">
      AI analyzed compatibility profile.
    </p>
  </div>
 );
}
