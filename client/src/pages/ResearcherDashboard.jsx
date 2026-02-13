import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Trash2, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const ResearcherDashboard = () => {
  const [experiments, setExperiments] = useState([]);
  const [search, setSearch] = useState('');
  const { logout, user } = useAuth();
  const { toast } = useToast()

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/api/experiments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setExperiments(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteExperiment = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:3001/api/experiments/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            toast({ title: "Experiment deleted" });
            fetchExperiments();
        }
    } catch (e) {
         toast({ title: "Error", variant: "destructive" });
    }
  };

  const filteredExperiments = experiments.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Researcher Workspace</h1>
            <p className="text-slate-500">Welcome, {user?.name || user?.email}</p>
        </div>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search experiments..." 
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/experiments/new">
                <Plus className="mr-2 h-4 w-4" /> New Experiment
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExperiments.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={4} className="text-center">No experiments found.</TableCell>
                  </TableRow>
              ) : (
                  filteredExperiments.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium">{exp.title}</TableCell>
                      <TableCell>{exp.category}</TableCell>
                      <TableCell>{new Date(exp.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" asChild>
                              <Link to={`/experiments/edit/${exp.id}`}>
                                  <Edit className="h-4 w-4" />
                              </Link>
                          </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteExperiment(exp.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearcherDashboard;
