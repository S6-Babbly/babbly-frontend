import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Sidebar from '@/components/Sidebar'
import AuthProvider from '@/components/AuthProvider'
import DynamicTitle from '@/components/DynamicTitle'
import SWRProvider from '@/components/SWRProvider'

// Default metadata
export const metadata = {
  title: 'Babbly',
  description: 'A modern social media platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-primary to-secondary text-textColor min-h-screen">
        <UserProvider>
          <SWRProvider>
            <AuthProvider>
              <DynamicTitle />
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 min-h-screen">
                  {/* Left Sidebar */}
                  <div className="col-span-3 p-4">
                    <Sidebar />
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
            </AuthProvider>
          </SWRProvider>
        </UserProvider>
      </body>
    </html>
  )
}
