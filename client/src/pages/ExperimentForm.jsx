import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Shadcn doesn't have textarea by default in 'add' command list of main list but usually installed? I'll check.
// If textarea not installed, using Input or standard textarea. Reverting to standard textarea with tailwind classes if needed. 
// Shadcn Textarea is typically just a styled textarea.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const ExperimentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    if (id) {
      fetchExperiment();
    }
  }, [id]);

  const fetchExperiment = async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:3001/api/experiments/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setFormData({
                title: data.title,
                description: data.description,
                category: data.category
            });
        }
    } catch (e) {
        console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = id 
        ? `http://localhost:3001/api/experiments/${id}`
        : 'http://localhost:3001/api/experiments';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            toast({ title: id ? "Experiment updated" : "Experiment created" });
            navigate('/experiments');
        } else {
            toast({ title: "Error saving experiment", variant: "destructive" });
        }
    } catch (e) {
         toast({ title: "Server error", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>{id ? 'Edit Experiment' : 'New Experiment'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                            id="title" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                            value={formData.category} 
                            onValueChange={(val) => setFormData({...formData, category: val})}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/experiments')}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Experiment
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
};

export default ExperimentForm;
