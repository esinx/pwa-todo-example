import { useState, useEffect } from "react"

export function useOnlineStatus() {
	const [isOnline, setIsOnline] = useState(navigator.onLine)

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true)
		}

		const handleOffline = () => {
			setIsOnline(false)
		}

		window.addEventListener("online", handleOnline)
		window.addEventListener("offline", handleOffline)

		// Also check for actual connectivity by attempting to fetch
		const checkConnectivity = async () => {
			try {
				const response = await fetch("/favicon.ico", {
					method: "HEAD",
					cache: "no-cache",
				})
				setIsOnline(response.ok)
			} catch {
				setIsOnline(false)
			}
		}

		// Check connectivity periodically when navigator.onLine is true
		const interval = setInterval(() => {
			if (navigator.onLine) {
				checkConnectivity()
			}
		}, 30000) // Check every 30 seconds

		return () => {
			window.removeEventListener("online", handleOnline)
			window.removeEventListener("offline", handleOffline)
			clearInterval(interval)
		}
	}, [])

	return isOnline
}
