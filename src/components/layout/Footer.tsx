export default function Footer() {
  return (
    <footer className="mt-auto border-t py-4 text-center text-sm text-muted-foreground bg-[#e9e9e9]">
      &copy; {new Date().getFullYear()} Tulos. All rights reserved.
    </footer>
  );
}
