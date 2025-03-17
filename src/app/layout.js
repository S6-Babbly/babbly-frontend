import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Babbly - A Twitter Clone',
  description: 'A modern social media platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-primary to-secondary text-textColor min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 min-h-screen">
            {/* Left Sidebar */}
            <div className="col-span-3 p-4">
              <nav className="fixed">
                <div className="flex flex-col gap-6">
                  <div className="text-3xl font-bold text-primary">Babbly</div>
                  <div className="flex flex-col gap-1">
                    <Link href="/" className="text-xl p-3 hover:bg-white/10 rounded-full transition-colors">Home</Link>
                    <Link href="#" className="text-xl p-3 hover:bg-white/10 rounded-full transition-colors">Explore</Link>
                    <Link href="#" className="text-xl p-3 hover:bg-white/10 rounded-full transition-colors">Notifications</Link>
                    <Link href="#" className="text-xl p-3 hover:bg-white/10 rounded-full transition-colors">Messages</Link>
                    <Link href="#" className="text-xl p-3 hover:bg-white/10 rounded-full transition-colors">Profile</Link>
                  </div>
                  <Link href="/create-post" className="bg-primary text-white rounded-full py-3 px-8 text-xl font-bold hover:bg-primary/90 transition-colors text-center">
                    Post
                  </Link>
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <main className="col-span-6 border-x border-white/20">
              {children}
            </main>

            {/* Right Sidebar */}
            <div className="col-span-3 p-4">
              <div className="fixed w-80">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                  <h2 className="text-xl font-bold mb-4">Who to follow</h2>
                  <div className="space-y-4">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20"></div>
                          <div>
                            <div className="font-bold group-hover:underline">User Name</div>
                            <div className="text-gray-400">@username</div>
                          </div>
                        </div>
                        <button className="bg-white text-secondary px-4 py-1.5 rounded-full text-sm font-bold hover:bg-white/90 transition-colors">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
