import { useParams } from "react-router-dom";

const BookDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Book Details Page - ID: {id}</h1>
    </div>
  );
};

export default BookDetailsPage;
