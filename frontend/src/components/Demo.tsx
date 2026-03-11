import ShimmerText from "@/components/ui/shimmer-text"

export default function Demo() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-8">
            <ShimmerText className="text-4xl font-bold tracking-tight">Introducing the future</ShimmerText>
            <ShimmerText variant="blue" className="text-6xl font-extrabold tracking-tighter">
                Blue Shimmer
            </ShimmerText>
            <ShimmerText variant="red" className="text-3xl font-medium">
                Red Alert
            </ShimmerText>
            <ShimmerText variant="green" className="text-5xl font-semibold">
                Eco Friendly
            </ShimmerText>
        </div>
    )
}
