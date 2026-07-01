import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchInputProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export default function SearchInput({
  placeholder,
  query,
  setQuery,
  setPage,
}: SearchInputProps) {
  const handleQuery = (e: string) => {
    setQuery(e);
    if (setPage) {
      setPage(1);
    }
  };

  return (
    <div className="flex-1 flex gap-1 bg-gray-200 items-center px-3 py-1">
      <Search />
      <Input
        className="w-full border-none px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleQuery(e.target.value)}
      />
    </div>
  );
}
