import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const useMembershipModal = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const handleApplyNow = async () => {
        try {
            const res = await fetch('http://localhost:3000/forms', { method: 'POST' })
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
