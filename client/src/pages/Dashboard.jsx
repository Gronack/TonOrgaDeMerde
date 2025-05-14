import AvailabilityTable from "../components/AvailabilityTable";

function Dashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Choisissez vos dispos pour JdR et Jeux de societé</h2>
      <AvailabilityTable />
    </div>
  );
}

export default Dashboard;
