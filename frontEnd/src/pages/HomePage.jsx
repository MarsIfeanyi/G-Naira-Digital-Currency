import MainNav from "../components/MainNav";

function HomePage() {
  return (
    <>
      <div className="mt-20 text-2xl px-8 flex flex-col md:flex-row">
        <h3
          className="justify-center text-center mx-auto text-blue-600
        "
        >
          Digitally Encrypted and Secured
        </h3>
      </div>

      <MainNav />
    </>
  );
}

export default HomePage;
