import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const useMembershipModal = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const handleApplyNow = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/forms`, { method: 'POST' })
            const { uuid } = await res.json()
            closeModal()
            navigate(`/membership/apply/${uuid}`)
        } catch (err) {
            console.error('failed to start form', err)
        }
    }

    return {
        isModalOpen,
        openModal,
        closeModal,
        handleApplyNow,
    }
}
