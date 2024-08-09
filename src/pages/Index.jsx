import ElectricityPriceGraph from '../components/ElectricityPriceGraph';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Swedish Electricity Spot Prices</h1>
        <ElectricityPriceGraph />
      </div>
    </div>
  );
};

export default Index;
