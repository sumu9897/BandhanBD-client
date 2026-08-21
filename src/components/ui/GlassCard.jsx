export default function GlassCard({children,className=""}){
 return (
  <div className={`backdrop-blur-xl bg-white/70 rounded-3xl shadow-xl border p-6 ${className}`}>
   {children}
  </div>
 );
}
