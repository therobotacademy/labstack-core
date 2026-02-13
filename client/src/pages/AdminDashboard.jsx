import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalExperiments: 0 });
  const { logout } = useAuth();
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3001/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:3001/api/users/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            toast({ title: "User deleted" });
            fetchUsers();
        } else {
             toast({ title: "Failed to delete user", variant: "destructive" });
        }
    } catch (e) {
        toast({ title: "Error", variant: "destructive" });
    }
  };

  const createResearcher = async () => {
      // Simple implementation: Create a random researcher for demo purposes
      // In a real app, this would be a form/modal
      const email = prompt("Enter email for new researcher:");
      if (!email) return;
      const password = prompt("Enter password:");
      if (!password) return;
      
      const token = localStorage.getItem('token');
      try {
          const res = await fetch('http://localhost:3001/api/users', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({ email, password, name: 'Researcher', role: 'RESEARCHER' })
          });
          if (res.ok) {
              toast({ title: "Researcher created" });
              fetchUsers();
          } else {
               toast({ title: "Failed to create", variant: "destructive" });
          }
      } catch (e) {
          toast({ title: "Error", variant: "destructive" });
      }
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>

      <div className="grid gap-6 mb-8">
          <Card>
              <CardHeader>
                  <CardTitle>System Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-2xl font-bold">{stats.totalExperiments} Total Experiments</p>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users Management</CardTitle>
          <Button onClick={createResearcher}>Add Researcher</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                      {user.role !== 'ADMIN' && (
                        <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
