export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html style={{overflow: "hidden"}}>
            <body>{children}</body>
        </html>
    );
}
