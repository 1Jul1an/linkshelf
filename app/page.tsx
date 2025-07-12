"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Globe,
  Edit3,
  Sun,
  Moon,
  ExternalLink,
  Plus,
  Save,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Particle background component
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-400/20 dark:bg-cyan-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Welche icon-Keys als „Social Icons“ oben angezeigt werden
const socialIconKeys: (keyof typeof linkIcons)[] = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "mail",
]


// Link icons mapping
const linkIcons = {
  globe: Globe,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  mail: Mail,
  plus: Plus,
}

interface Link {
  id: string
  title: string
  description: string
  url: string
  icon: keyof typeof linkIcons
}


export default function LinkShelf() {
  const [isDark, setIsDark] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Sample data
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    description: "Full-stack developer & UI/UX enthusiast",
    avatar: "/placeholder.svg?height=120&width=120",
  })


  const [links, setLinks] = useState<Link[]>([
    {
      id: "1",
      title: "Portfolio Website",
      description: "Check out my latest projects and case studies",
      url: "https://example.com",
      icon: "globe",
    },
    {
      id: "2",
      title: "GitHub Profile",
      description: "Open source projects and contributions",
      url: "https://github.com",
      icon: "github",
    },
    {
      id: "3",
      title: "LinkedIn",
      description: "Professional network and career updates",
      url: "https://linkedin.com",
      icon: "linkedin",
    },
    {
      id: "4",
      title: "Design System",
      description: "Component library and design tokens",
      url: "https://example.com/design",
      icon: "plus",
    },
  ])

  const [newLink, setNewLink] = useState<Omit<Link, "id">>({
    title: "",
    description: "",
    url: "",
    icon: "globe",
  })

  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const socialLinks = React.useMemo(
      () => links.filter((l) => socialIconKeys.includes(l.icon)),
      [links]
  )

  {socialLinks.map((link, index) => {
    const Icon = linkIcons[link.icon]
    return (
        <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-cyan-500 transition-all duration-300 group"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
        >
          <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors duration-300" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/0 to-cyan-500/0 group-hover:from-indigo-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
        </motion.a>
    )
  })}



  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const link: Link = {
        ...newLink,
        id: Date.now().toString(),
      }
      setLinks([...links, link])
      setNewLink({ title: "", description: "", url: "", icon: "globe" })
      setIsAddingLink(false)
    }
  }

  const handleEditLink = (link: Link) => {
    setEditingLink(link)
  }

  const handleUpdateLink = () => {
    if (editingLink) {
      setLinks(links.map((link) => (link.id === editingLink.id ? editingLink : link)))
      setEditingLink(null)
    }
  }

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
    setEditingLink(null)
  }

  if (!mounted) return null

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <ParticleBackground />

      {/* Theme Toggle */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-300"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </motion.div>

      {/* Edit Mode Toggle */}
      <motion.div
        className="fixed top-6 right-20 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingProfile(true)}
            className="rounded-full mr-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:scale-105 transition-all duration-300"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`
    rounded-full backdrop-blur-sm transition-all duration-300
    border border-gray-300 dark:border-gray-700
    hover:scale-105
    ${isEditMode
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"}
  `}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditMode ? "Done" : "Edit Links"}
        </Button>
      </motion.div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <img
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full mx-auto border-4 border-white dark:border-gray-700 shadow-2xl"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 animate-pulse" />
              </div>
            </motion.div>

            {/* Name and Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                {profile.name}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">{profile.description}</p>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center space-x-6 mb-16"
            >
              {socialLinks.map((social, index) => {
                const Icon = linkIcons[social.icon]
                return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-cyan-500 transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/0 to-cyan-500/0 group-hover:from-indigo-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Links Section */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {links.map((link, index) => {
                const Icon = linkIcons[link.icon]
                return (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-cyan-500/10">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div
                            className="flex items-center space-x-4 flex-1 cursor-pointer"
                            onClick={() => window.open(link.url, "_blank")}
                          >
                            <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                                {link.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{link.description}</p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition-colors duration-300" />
                          </div>
                          {isEditMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLink(link)}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}

              {/* Add Link Button */}
              {isEditMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-cyan-500 transition-all duration-300 cursor-pointer"
                    onClick={() => setIsAddingLink(true)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors duration-300">
                        <Plus className="h-5 w-5" />
                        <span>Add New Link</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer
            className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-10 pb-16 text-center text-sm text-slate-500 dark:text-slate-400 transition-all duration-300">
          <div className="container mx-auto px-4">
            <p>
              Built with ❤️ by{" "}
              <a
                  href="https://julianb.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
              >
                Julian
              </a>{" "}
              · LinkShelf {new Date().getFullYear()}
            </p>
            <div className="mt-4 flex justify-center gap-4 text-slate-400 dark:text-slate-500">
              <a
                  href="https://github.com/1Jul1an"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
              <a
                  href="mailto:julianbusinessadress@gmail.com"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative group w-24 h-24">
                <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-md"
                />
                <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="text-xs text-white font-medium">Change</span>
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full"
                  placeholder="Your name"
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Short Bio
              </Label>
              <Textarea
                  id="bio"
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  placeholder="Tell us something short about yourself..."
                  className="w-full min-h-[80px]"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditingProfile(false)}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>



      {/* Edit Link Modal */}
      <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          {editingLink && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingLink.description}
                  onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-icon">Icon</Label>
                <Select
                  value={editingLink.icon}
                  onValueChange={(value: keyof typeof linkIcons) => setEditingLink({ ...editingLink, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(linkIcons).map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center space-x-2">
                          {React.createElement(linkIcons[icon as keyof typeof linkIcons], { className: "h-4 w-4" })}
                          <span className="capitalize">{icon}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="destructive" onClick={() => handleDeleteLink(editingLink.id)}>
                  Delete
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setEditingLink(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateLink}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Link Modal */}
      <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="Enter link title"
              />
            </div>
            <div>
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                placeholder="Enter link description"
              />
            </div>
            <div>
              <Label htmlFor="new-url">URL</Label>
              <Input
                id="new-url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="new-icon">Icon</Label>
              <Select
                value={newLink.icon}
                onValueChange={(value: keyof typeof linkIcons) => setNewLink({ ...newLink, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(linkIcons).map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center space-x-2">
                        {React.createElement(linkIcons[icon as keyof typeof linkIcons], { className: "h-4 w-4" })}
                        <span className="capitalize">{icon}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddingLink(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLink} disabled={!newLink.title || !newLink.url}>
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
