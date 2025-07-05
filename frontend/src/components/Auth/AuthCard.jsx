import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const AuthCard = ({ title, description, children }) => (
  <Card className="w-full max-w-md border-gray-200 shadow-sm">
    <CardHeader className="text-center">
      <CardTitle className="text-3xl font-bold">{title}</CardTitle>
      {description && <CardDescription className="pt-2">{description}</CardDescription>}
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

export default AuthCard;
