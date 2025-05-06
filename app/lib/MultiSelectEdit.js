"use client";

import { useApiRequest } from "@/app/hooks/useApiRequest";
import { getCookie } from "@/app/lib/cookies";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function MultiSelectEdit({ onChange, value = [] }) {
    const inputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(value); // Use value as initial state
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const { makeRequest } = useApiRequest();

    useEffect(() => {
        // Update selected state if the parent value changes
        setSelected(value);
    }, [value]);

    // Fetch options from the API
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const token = getCookie("token"); // ✅ Retrieve token

                const response = await makeRequest({
                    url: `${process.env.NEXT_PUBLIC_API_URL}/vendor/colors/`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Pass token in Authorization header
                    },
                });

                if (response.success) {
                    setOptions(
                        response.data.map((color) => ({
                            value: color.id,
                            label: color.name,
                            hexCode: color.hex_code, // ✅ Include hex code for color display
                        }))
                    );
                }
            } catch (error) {
                console.error("Failed to fetch colors:", error);
            }
        };

        fetchColors();
    }, []);

    const handleUnselect = useCallback(
        (item) => {
            setSelected((prev) => {
                const newSelected = prev.filter((s) => s.value !== item.value);
                onChange?.(newSelected);
                return newSelected;
            });
        },
        [onChange]
    );

    const handleKeyDown = useCallback(
        (e) => {
            const input = inputRef.current;
            if (input) {
                if ((e.key === "Delete" || e.key === "Backspace") && input.value === "") {
                    setSelected((prev) => {
                        const newSelected = [...prev];
                        newSelected.pop();
                        onChange?.(newSelected);
                        return newSelected;
                    });
                }
                if (e.key === "Escape") {
                    input.blur();
                }
            }
        },
        [onChange]
    );

    const selectables = options.filter(
        (option) => !selected.some((s) => s.value === option.value)
    );

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selected.map((item) => (
                        <Badge key={item.value} variant="secondary" className="flex items-center gap-2">
                            {/* ✅ Show Color Square */}
                            <div
                                style={{
                                    backgroundColor: item.hexCode,
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "2px",
                                }}
                            />
                            {item.label}
                            <button
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={() => handleUnselect(item)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground"/>
                            </button>
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select items..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div
                            className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => {
                                            setInputValue("");
                                            setSelected((prev) => {
                                                const newSelected = [...prev, item];
                                                onChange?.(newSelected);
                                                return newSelected;
                                            });
                                        }}
                                        className="flex items-center gap-2 cursor-pointer bg-white"
                                    >
                                        {/* ✅ Show Color Square */}
                                        <div
                                            style={{
                                                backgroundColor: item.hexCode,
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "2px",
                                            }}
                                        />
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}

export default MultiSelectEdit;
