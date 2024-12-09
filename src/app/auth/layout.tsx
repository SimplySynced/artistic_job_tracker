export default function AuthLayout({ children }: any) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-4 p-4 pt-0 w-full">
                    <div className="w-full ">
                        {children}
                    </div>
                    <div className="flex-1 rounded-xl bg-muted/50" />
                </div>
            </div>
        </div>
    );
}