import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Toast {
  id: number
  message: string
  metadata: any
}

interface CustomToastProps {
  message: string
  metadata: any
  onClose: () => void
}

const CustomToast = ({ message, metadata, onClose }: CustomToastProps) => {
  return (
    <div
      className="fixed top-4 right-4 bg-background text-foreground shadow-lg rounded-md p-4 animate-fade-in"
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-center gap-2">
        <div className="text-sm">{message}</div>
        <a 
          href={`/protected/matchmaking?code=${metadata.gameCode}`}
          className="px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm"
        >
          Join!
        </a>
        <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
    </div>
  )
}

const InviteListener = () => {
  const supabase = createClient()
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    const subscription = supabase
      .channel('notification-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notifications',
        },
        (payload) => {
          console.log(payload)
          const newToast = {
            id: Date.now(),
            message: payload.new.message,
            metadata: payload.new.metadata,
          }
          setToasts((current) => [...current, newToast])

          // Auto-remove toast after 5 seconds
          setTimeout(() => removeToast(newToast.id), 5000)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      {toasts.map((toast) => (
        <CustomToast
          key={toast.id}
          message={toast.message}
          metadata={toast.metadata}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}

export default InviteListener
