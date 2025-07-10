import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface NavigatorStandalone extends Navigator {
	standalone?: boolean
}

export function InstallButton() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null)
	const [isInstalled, setIsInstalled] = useState(false)
	const [isInstalling, setIsInstalling] = useState(false)

	useEffect(() => {
		// Check if app is already installed
		const checkInstalled = () => {
			// Check if running in standalone mode (installed)
			if (window.matchMedia("(display-mode: standalone)").matches) {
				setIsInstalled(true)
				return
			}

			// Check if running as PWA on iOS
			if ((window.navigator as NavigatorStandalone).standalone === true) {
				setIsInstalled(true)
				return
			}
		}

		checkInstalled()

		// Listen for the beforeinstallprompt event
		const handleBeforeInstallPrompt = (e: Event) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault()
			// Save the event so it can be triggered later
			setDeferredPrompt(e as BeforeInstallPromptEvent)
		}

		// Listen for successful installation
		const handleAppInstalled = () => {
			setIsInstalled(true)
			setDeferredPrompt(null)
		}

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
		window.addEventListener("appinstalled", handleAppInstalled)

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			)
			window.removeEventListener("appinstalled", handleAppInstalled)
		}
	}, [])

	const handleInstallClick = async () => {
		if (!deferredPrompt) return

		setIsInstalling(true)

		try {
			// Show the install prompt
			await deferredPrompt.prompt()

			// Wait for the user to respond to the prompt
			const { outcome } = await deferredPrompt.userChoice

			if (outcome === "accepted") {
				console.log("User accepted the install prompt")
			} else {
				console.log("User dismissed the install prompt")
			}
		} catch (error) {
			console.error("Error during installation:", error)
		} finally {
			// Clear the deferredPrompt so it can only be used once
			setDeferredPrompt(null)
			setIsInstalling(false)
		}
	}

	// Don't show button if already installed or prompt not available
	if (isInstalled || !deferredPrompt) {
		return null
	}

	return (
		<Button
			onClick={handleInstallClick}
			disabled={isInstalling}
			size="sm"
			className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
			{isInstalling ? (
				<>
					<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
					Installing...
				</>
			) : (
				<>
					<Download className="w-4 h-4" />
					Install App
				</>
			)}
		</Button>
	)
}

// iOS Install Instructions Component
export function IOSInstallInstructions() {
	const [showInstructions, setShowInstructions] = useState(false)

	useEffect(() => {
		// Check if user is on iOS and not in standalone mode
		const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
		const isStandalone =
			(window.navigator as NavigatorStandalone).standalone === true
		const isInWebAppiOS = window.matchMedia(
			"(display-mode: standalone)"
		).matches

		if (isIOS && !isStandalone && !isInWebAppiOS) {
			setShowInstructions(true)
		}
	}, [])

	if (!showInstructions) return null

	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
			<div className="flex items-start gap-3">
				<Download className="w-5 h-5 text-blue-600 mt-0.5" />
				<div>
					<h3 className="font-medium text-blue-900 mb-1">Install this app</h3>
					<p className="text-sm text-blue-700 mb-2">
						Install this app on your home screen for a better experience.
					</p>
					<p className="text-xs text-blue-600">
						Tap the share button{" "}
						<span className="font-mono bg-blue-100 px-1 rounded">⬆</span> and
						then "Add to Home Screen"
					</p>
				</div>
				<button
					onClick={() => setShowInstructions(false)}
					className="text-blue-400 hover:text-blue-600 text-xl leading-none">
					×
				</button>
			</div>
		</div>
	)
}
