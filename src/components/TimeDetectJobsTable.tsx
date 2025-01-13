import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimeDetectJob {
  id: string;
  job_id: string;
  status: string;
  dataset_id: string | null;
  customer_id: string;
  created_at: string;
  completed_at: string | null;
  presigned_url: string;
}

interface TimeDetectJobsTableProps {
  jobs: TimeDetectJob[];
  isLoading: boolean;
}

export const TimeDetectJobsTable = ({ jobs, isLoading }: TimeDetectJobsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">TimeDetect Jobs</h2>
      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dataset ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead className="max-w-[300px]">Presigned URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Loading jobs...
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.job_id}</TableCell>
                  <TableCell>{job.status || 'pending'}</TableCell>
                  <TableCell>{job.dataset_id}</TableCell>
                  <TableCell>{job.customer_id}</TableCell>
                  <TableCell>{formatDate(job.created_at)}</TableCell>
                  <TableCell>
                    {job.completed_at ? formatDate(job.completed_at) : '-'}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate" title={job.presigned_url}>
                    {job.presigned_url}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};