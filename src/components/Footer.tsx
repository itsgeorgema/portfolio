export default function Footer() {
  return (
    <footer className="bg-nardo-500 text-accent-white">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()}, Made on lots of Red Bull.
        </p>
      </div>
    </footer>
  );
}